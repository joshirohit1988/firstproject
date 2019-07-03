import React from "react";
/** This component renders individual planet
 * Planet can be of three size based on Population small, medium, large 
 * based on the above Planet Name font size will be changed accordingly
 *
 */
export function Planet(props) {
  const getPlanetSize = (population)=>{
    return (population >= 1000000000)? 'large': (population >= 1000000) ? 'medium' : 'small'
  }
  const size = {
    small: 'planet-small', // population 0-1000000 => small  Font-size: 13px
    medium: 'planet-medium', // population 100001-1000000000 => medium Font-size: 18px
    large: 'planet-large', // population > 100000000 => large Font-size: 26px
  }
  return (
    <div className='color-black'>
      <p className={size[getPlanetSize(props.population)]}>Planet Name: {props.name}</p>
      <p className="planet-info">
        <span> Population: {props.population} ; </span>
        <span > Terrain: {props.terrain} ; </span>
        <span> Gravity: {props.gravity} ; </span>
      </p>
    </div>
  );
}
