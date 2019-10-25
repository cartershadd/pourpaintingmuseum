import React, {Component} from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import {LinkContainer} from 'react-router-bootstrap';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase';
import Button from 'react-bootstrap/Button';

class Navigation extends Component {
    state = {
        isSignedIn: false
    };

    uiConfig = {
        // Popup signin flow rather than redirect flow.
        signInFlow: 'popup',
        // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
        signInSuccessUrl: '/',
        // We will display Google and Facebook as auth providers.
        signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            // firebase.auth.FacebookAuthProvider.PROVIDER_ID
        ],
        callbacks: {
            // Avoid redirects after sign-in.
            signInSuccessWithAuthResult: () => false
        }
    };

    componentDidMount() {
        this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
            (user) => this.setState({isSignedIn: !!user})
        );
    }
    // Make sure we un-register Firebase observers when the component unmounts.
    componentWillUnmount() {
        this.unregisterAuthObserver();
    }

    render() {
        return (
            <div>

                    <Navbar collapseOnSelect expand="*" bg="dark" variant="dark">
                        <Navbar.Brand href="/">The Museum of Pour Painting</Navbar.Brand>
                        <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav className="mr-auto">
                                <LinkContainer exact to="/myUploads">
                                    <Nav.Link to="/myUploads">My Uploads</Nav.Link>
                                </LinkContainer>
                                <LinkContainer exact to="/">
                                    <Nav.Link>Search</Nav.Link>
                                </LinkContainer>
                            </Nav>
                            {this.state.isSignedIn ?
                                <div className="login-container">
                                    <img className="display-pic" src={firebase.auth().currentUser.photoURL} alt="display-pic"/>
                                    <p className="login-greeting">Welcome {firebase.auth().currentUser.displayName}! <br></br>You are now signed-in!</p>
                                    <Button size="sm" className="logout" onClick={() => firebase.auth().signOut()} >Sign-out</Button>
                                </div>
                                :
                                <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()}/>
                            }
                        </Navbar.Collapse>
                    </Navbar>

            </div>

        )
    }
}

export default Navigation;