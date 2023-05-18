import React from 'react';
import Marquee from "react-double-marquee";

class MarqueeTop extends React.Component {
  render() {
    return (
      <div className="marquee-top">
        <Marquee direction="left">
          $BOI AVAILABLE NOW! $BOI AVAILABLE NOW! $BOI AVAILABLE NOW! $BOI AVAILABLE NOW! $BOI AVAILABLE NOW!
        </Marquee>
      </div>
    );
  }
}

export default MarqueeTop;
