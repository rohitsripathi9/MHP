import React from 'react';
import { Typewriter } from 'react-simple-typewriter';
import './MyComponent.css'

const MyComponent = () => {

  const handleType = (count: number) => {
    // access word count number

  }

  const handleDone = () => {
    console.log('Done after 5 loops!');
  }

  return (
    <div className='App'>
      <h1 >
        <span className="typewriter-text">
          {/* Style will be inherited from the parent element */}
          <Typewriter
            words={['PreOrder' ,'Your' ,'Food Here' ,]}
            loop={500}
            cursor
            cursorStyle='_'
            typeSpeed={70}
            deleteSpeed={50}
            delaySpeed={1000}
            onLoopDone={handleDone}
            onType={handleType}
          />
        </span>
      </h1>
    </div>
  );
}

export default MyComponent;
