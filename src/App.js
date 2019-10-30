import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Navigation from "./Pages/Navigation";
import UploadPage from "./Pages/uploadPage";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Search from "./Pages/Search";
import PersonalUploads from './Pages/PersonalUploads';


function App() {
    return (
        <div className="App">
            <Router>
                <Navigation/>
                <Switch>
                    <Route exact path="/myUploads" component={PersonalUploads}/>
                    <Route exact path="/uploads" component={UploadPage}/>
                    <Route exact path="/" component={Search}/>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
