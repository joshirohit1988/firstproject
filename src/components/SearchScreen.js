import React from "react";
import axios from "axios";
import { PlanetList } from "./PlanetList";
import { Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, switchMap, tap, filter } from 'rxjs/operators';
import { PlanetDetails } from "./PlanetDetails";
import { Spinner } from './Spinner';
import Background from '../assets/star-wars-planet.jpg';

const planetSearchUrl = "https://swapi.co/api/planets/?search=";

export class SearchScreen extends React.Component {
  state = { planetName: "", results: [], loading: false, planetUrl: "" };
  searchSubject$ = new Subject(); // fires events on each search input
  timerID;
  searchCount = 0;  // keeps no of times search/ api call happens
  noOfsecond = 0; // no of second elapsed after opening the screen
  planetDetail; // have the details of the planet which is selected(clicked) from the list
  onInputChange = value => {
    if (this.searchCount > 5 && this.props.userName !== "Luke Skywalker") {
      alert("only Luke Skywalker can make more than 5 searches in a minute");
      return;
    }
    this.planetDetail = null;
    value ? this.setState({ loading: true, planetName: value }): this.setState({ planetName: value })
  };

  setPlanetDetail = (planet) => {
    if (planet) {
      this.planetDetail = planet;
    }
    this.setState({ planetUrl: "" }); // TODO : dummy state to re-rende
  };

  componentDidMount() {
    this.timerID = setInterval(() => {
      this.noOfsecond++;
      if (this.noOfsecond % 60 === 0) {
        this.searchCount = 0; // reset search count every 60 seconds
      }
    }, 1000);
    // used Rxjs operator for better search experience
    this.searchSubject$.pipe(
      tap((value) => this.onInputChange(value)),
      filter(() => this.props.userName === "Luke Skywalker".trim() || this.searchCount <= 5),
      debounceTime(400),
      distinctUntilChanged(),
      filter((val)=> val && val.trim()),
      switchMap(value => axios.get(`${planetSearchUrl}${value}`))
    ).subscribe((resp) => {
      this.searchCount++; // search count is only increased if search is successful
      this.setState({ results: resp.data.results, loading: false });
    });
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }
  render() {
    return (
        <div className="color-black">
        {/* <div className="search-screen" style={{
        backgroundImage: 'url(' + Background + ')',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
      }}> */}
        <div style={{float: 'right'}}>
        <span>Welcome {this.props.userName}</span>
        <br/>
        <button onClick={this.props.logout}>Logout</button>
        </div>
        <div className="align-center">
          <h2> Search STAR WARS Planets</h2>
          <input
            placeholder="Enter Planet Name"
            value={this.state.planetName}
            onChange={event => this.searchSubject$.next(event.target.value)}
          />
        </div>
        <div className="flex-class">
          <div className="planet-names">
            <PlanetList
              planetName={this.state.planetName}
              loading={this.state.loading}
              results={this.state.results}
              setDetails={this.setPlanetDetail}
            />
          </div>
          <div className="details-width">
            {this.planetDetail ? <PlanetDetails {...this.planetDetail} /> : ""}
          </div>
        </div>
        {this.state.loading && <Spinner></Spinner>}
      </div>
    );
  }
}
