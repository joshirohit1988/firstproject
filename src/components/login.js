import React from "react";
import { Redirect } from "react-router-dom";
import { Subject } from "rxjs";
import { exhaustMap, takeUntil } from 'rxjs/operators';
import axios from "axios";
import { Spinner } from './Spinner';

const userSearchUrl = "https://swapi.co/api/people/?search=";
/** this component has login logic
 */
export class Login extends React.Component {
  state = {
    redirectToSearch: false,
    username: "",
    password: "",
    showError: false,
    loading: false
  };
  loginSubmit$ = new Subject(); // fires events on each search input
  errorMsg = "";
  unsubscribe$ = new Subject();

  validate = (userData) => {
    if (userData && userData.birth_year === this.state.password) {
      this.props.doLogin(this.state.username);
      return true;
    } 
    this.setErrorMsg('Invalid Password');
    return false
  };

  setErrorMsg = (msg) => {
    this.errorMsg = msg;
    this.setState({ showError: true });
  }

  componentDidMount() {
    console.log('did mount');
    this.loginSubmit$.pipe(
      takeUntil(this.unsubscribe$),
      exhaustMap(() => axios.get(`${userSearchUrl}${this.state.username}`))
    ).subscribe((res) => {
      let isValidCredential = false;
      if (res.data.count === 0) {
        this.setErrorMsg('Username not found');
        return;
      } else if (res.data.results) {
        const userData = res.data.results.find(el => el.name === this.state.username);
        if (userData) {
          isValidCredential = this.validate(userData)
        } else {
          this.setErrorMsg('Username not found');
        }
      }
      this.setState({ loading: false, redirectToSearch: isValidCredential });
    },()=> this.setState({ loading: false }));
  }
  componentWillUnmount(){
    this.unsubscribe$.next();
  }

  render() {
    let { redirectToSearch } = this.state;

    if (redirectToSearch)
      return (
        <Redirect
          to={{
            pathname: "/search",
            state: { from: this.props.location }
          }}
        />
      );
    return (
      <div className="align-center">
        <h1>Star Wars Login Screen</h1>
        <h3>Please Sign To Navigate To Search Screen</h3>

        <form onSubmit={(e) => {
          this.loginSubmit$.next(this.state);
          e.preventDefault();
          this.setState({ showError: false, loading: true })
        }}>
          <label htmlFor="username">Username : </label>
          <input
            id="username"
            placeholder="Enter username"
            value={this.state.username}
            onChange={event => this.setState({ username: event.target.value })}
          />
          <br />
          <label htmlFor="password"> Password : </label>
          <input
            type="password"
            id="password"
            placeholder="Enter Password"
            value={this.state.password}
            onChange={event => this.setState({ password: event.target.value })}
          />
          <br />
          <button type="submit">Log in</button>

        </form>
        <br />
        {this.state.showError && <span>{this.errorMsg}</span>}
        {this.state.loading && <Spinner></Spinner>}
      </div>

    );
  }
}
