import React from "react";
/** This component shows the planet detail on right side of Planet Search Screen 
 * used function component here 
*/
export function PlanetDetails(props) {
  if (!props.name) {
    return null;
  }
  return (
    <div className="planet-details">
      <h3>Planet Details </h3>
      <p>Name: {props.name}</p>
      <p>Climate: {props.climate}</p>
      <p>Diameter: {props.diameter}</p>
      <p>Rotation Period: {props.rotation_period}</p>
      <p>Orbital Period: {props.orbital_period}</p>

      <p>Gravity: {props.gravity}</p>
      <p>Terrain: {props.terrain}</p>
      <p>Surface Water: {props.surface_water}</p>
      <p>population: {props.population}</p>
      <p>created: {props.created}</p>
      <p>edited: {props.edited}</p>
      <div>
        Films:
        <br/>
        {props.films.map((film, index) => (
          <div key={index}>
          <span>
            {" "}
            film-{index}: {film}
          </span>
          </div>
        ))}
      </div>
      <div>
       Residents:
       <br/>
        {props.residents.map((resident, index) => (
          <div key={index}>
          <span >
            {" "}
            resident-{index}: {resident}
          </span>
          </div>
        ))}
      </div>

    </div>
  );
}
