import React from "react";
import { Planet } from "./Planet";
/** This component loads the planet list based on search results */
export class PlanetList extends React.Component {
  bgColors = index => (index % 2 === 0 ? "white" : "#cbcbcb");
  handleClick = planet => {
    this.props.setDetails(planet);
  };
  render() {
    let resultsRender;
    if (this.props.planetName.length === 0) {
      resultsRender = ""; // do nothing
    } else if (!this.props.loading && this.props.results.length) {
      resultsRender = (
        <div>
            <h4>{this.props.results.length} {this.props.results.length > 1 ? 'Search Results Found': ' Search Result Found'}</h4>
      
          {this.props.results.map((planet, index) => (
            <div
              onClick={() => this.handleClick(planet)}
              key={index}
              style={{ backgroundColor: this.bgColors(index) }}
            >
              <Planet {...planet} />
            </div>
          ))}
        </div>
      ); // show planet list
    } else if (this.props.loading) {
      resultsRender = <h4>... Loading</h4>; // show loading during api call
    } else {
      resultsRender = <h4> No Results Found</h4>; // show no results found when api has returned Zero results
    }
    return <div>{resultsRender}</div>;
  }
}
