import {loginContext,idContext} from './context/idContext';
import Head from './component/Head';
import {BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import Login from './component/Login';
import Main from './component/Main';
import Register from './component/Register';
import { useState } from 'react';
import Index from './component/Index';
import Input from './component/Input';
import Diet from './component/Diet';
import Food from './component/Food';
import Winput from './component/Winput';
import DietRecord from './component/DietRecord';
import WeightChange from './component/WeightChange';
import DietDetail from './component/DietDetail';
import Myinfo from './component/MyInfo';
import WorkOut from './component/Workout';
import TargetWeight from './component/TargetWeight';
import NotFound from './component/NotFound';
import Activity from './component/Activity';

function App() {
  const [id,setId] = useState("");
  const [login,setLogin] = useState(false);
  
  return (
    <idContext.Provider value={{id,setId}}>
      <loginContext.Provider value={{login,setLogin}}>
        <Router>
          <div className="App">
            <Head/>
            <Routes>
              <Route path="/" element={<Index/>}/>
              <Route path="/login" element={<Login/>}/>
              <Route path="/register" element={<Register/>}/>
              <Route path="/id/:id" element={<Main/>}/>
              <Route path="/id/:id/target_weight" element={<TargetWeight/>}/>
              <Route path="/id/:id/hw_input" element={<Input/>}/>
              <Route path="/id/:id/w_input" element={<Winput/>}/>
              <Route path="id/:id/diet" element={<Diet/>}/>
              <Route path="/id/:id/dietRecord" element={<DietRecord/>}/>
              <Route path="/id/:id/dietRecord/:date" element={<DietDetail/>}/>
              <Route path="/id/:id/diet/:meal_time" element={<Food/>}/>
              <Route path="/id/:id/weight_change" element={<WeightChange/>}/>
              <Route path="/id/:id/myinfo" element={<Myinfo/>}/>
              <Route path="/id/:id/workout" element={<WorkOut/>}/>
              <Route path="/id/:id/activity" element={<Activity/>}/>
              <Route path="/*" element={<NotFound/>}/>
              
            </Routes>
          </div>
        </Router>
      </loginContext.Provider>
    </idContext.Provider>
  );
}

export default App;
