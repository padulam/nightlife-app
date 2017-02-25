import React from 'react';

const Rsvp = (props) => {
  const _handleClick = () =>{
    props.submitRsvp();
  }

  let status;

  if(props.attending){
    status = "I'm not going"
  } else{
    status = "I'm going";
  }

  return(
    <button onClick={_handleClick} className="btn rsvp-location ghost-button">{status}</button>
  );
}

export default Rsvp;