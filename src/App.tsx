import React, {useState} from 'react';
import LoginForm from './components/Forms/LoginForm';
import './index.sass'
import {isLoggedType } from './types/HookTypes';
import Spinner from './components/UI/Spinner';


function App(): JSX.Element {
  const [isLogged,setIsLogged] = useState<isLoggedType>(isLoggedType.FALSE)

  
 
  return (
    <div className="App">
      <div className='formWrapper'>
        <h1>React chat app</h1>
      { isLogged === isLoggedType.FALSE && <LoginForm/>}
      {isLogged === isLoggedType.INITIAL && <Spinner/>}
      </div>
      
    </div>
  );
}

export default App;
