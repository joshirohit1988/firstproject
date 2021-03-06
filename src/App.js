import React from "react";
import { SearchScreen } from "./components/SearchScreen";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import { Login } from "./components/login";
import { PageNotFound } from "./components/PageNotFound";

const userStateKey = 'userStatekey';

export class App extends React.Component {
  state = { isLoggedIn: false, loginName: "" };
  initiateLogin = name => {
    this.setState({ isLoggedIn: true, loginName: name });
    localStorage.setItem(userStateKey, JSON.stringify(this.state));
  };
  initiatelogout = () => {
    this.setState({ isLoggedIn: false });
    localStorage.clear();
  };

  componentDidMount() {
    const userState = localStorage.getItem(userStateKey);
    if (userState) {
      let userData;
      try {
        userData = JSON.parse(userState);
      } catch (e) {
        userData = null;
       console.log('cannot parse local storage');
      }
      if (userData) {
        console.log('Mounted state from local storage', userData);
        this.setState(userData);
      }
    }
  }

  render() {
    return (
      <Router>
        <div>
          <Switch>
            <Route
              path="/login"
              render={() => this.state.isLoggedIn ? (
                <Redirect
                    to={{
                      pathname: "/search",
                      state: { from: this.props.location }
                    }}
                  />
              ) :
              <Login doLogin={this.initiateLogin}/>}
            />
            <Route
              path="/"
              exact
              render={() =>
                this.state.isLoggedIn ? (
                  <Redirect
                    to={{
                      pathname: "/search",
                      state: { from: this.props.location }
                    }}
                  />
                ) : (
                  <Redirect
                    to={{
                      pathname: "/login",
                      state: { from: this.props.location }
                    }}
                  />
                )
              }
            />
            <Route
              path="/search"
              exact
              render={() =>
                this.state.isLoggedIn ? (
                  <SearchScreen
                    userName={this.state.loginName}
                    logout={this.initiatelogout}
                  />
                ) : (
                  <Redirect
                    to={{
                      pathname: "/login",
                      state: { from: this.props.location }
                    }}
                  />
                )
              }
            />
            <Route component={PageNotFound} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
