import React, {Component} from 'react';
import Form from 'react-bootstrap/Form';
import {db, storage} from "../firebase";
import {FilePond, registerPlugin} from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import firebase from "firebase";
import shortid from 'shortid';
import Button from "react-bootstrap/Button";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

class UploadPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dirty: false,
            silicone: false,
            flip: false,
            dutch: false,
            balloon: false,
            colander: false,
            floetrol: false,
            hairdryer: false,
            liquitex: false,
            other: false,
            blowtorch: false,
            image: '',
            files: [],
            isSignedIn: false
        }
    }

    uiConfig = {
        // Popup signin flow rather than redirect flow.
        signInFlow: 'popup',
        // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
        signInSuccessUrl: '/uploads',
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

    onSubmit = (e) => {
        e.preventDefault();
        if (this.state.isSignedIn === false) {
            alert("Please login to upload a painting.");
            return
        }
        if (this.state.image === '') {
            alert('Please select an image to upload.');
            return
        }

        db.collection('paintings').add({
            dirty: this.state.dirty,
            silicone: this.state.silicone,
            flip: this.state.flip,
            dutch: this.state.dutch,
            balloon: this.state.balloon,
            colander: this.state.colander,
            floetrol: this.state.floetrol,
            hairdryer: this.state.hairdryer,
            liquitex: this.state.liquitex,
            other: this.state.other,
            blowtorch: this.state.blowtorch,
            image: this.state.image,
            uid: firebase.auth().currentUser.uid
        }).then(() => {
            alert('Submitted successfully');
        })
    };

    updateInput = e => {
        console.log(e.target.name);
        this.setState({
            [e.target.name]: e.target.valueOf().checked
        });
    };

    server = {
        // this uploads the image using firebase
        process: (fieldName, file, metadata, load, error, progress, abort) => {
            // create a unique id for the file
            const id = shortid.generate();

            // upload the image to firebase
            const task = storage.child('images/' + id).put(file, {
                contentType: 'image/jpeg',
            });

            // monitor the task to provide updates to FilePond
            task.on(
                firebase.storage.TaskEvent.STATE_CHANGED,
                snap => {
                    // provide progress updates
                    progress(true, snap.bytesTransferred, snap.totalBytes)
                },
                err => {
                    // provide errors
                    error(err.message)
                },
                () => {
                    // the file has been uploaded
                    load(id);

                    let tempThis = this;

                    storage.child('images/' + id).getDownloadURL().then(function (url) {
                            console.log(url);
                            tempThis.setState({image: url});
                        }
                    );
                }
            )
        },

        // this loads an already uploaded image to firebase
        load: (source, load, error, progress, abort) => {
            // reset our progress
            progress(true, 0, 1024);

            // fetch the download URL from firebase
            storage
                .child('images/' + source)
                .getDownloadURL()
                .then(url => {


                    // fetch the actual image using the download URL
                    // and provide the blob to FilePond using the load callback
                    let xhr = new XMLHttpRequest();
                    xhr.responseType = 'blob';
                    xhr.onload = function (event) {
                        let blob = xhr.response;
                        load(blob)
                    };
                    xhr.open('GET', url);
                    xhr.send()
                })
                .catch(err => {
                    error(err.message);
                    abort()
                })
        },
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
                {this.state.isSignedIn ?
                    <Form className="upload-form" onSubmit={this.onSubmit}>
                        <Form.Label className="form-label" column={1}>Upload Your Work Here!</Form.Label>
                        <FilePond
                            ref={ref => (this.pond = ref)}
                            files={this.state.files}
                            allowMultiple={false}
                            maxFiles={1}
                            server={this.server}
                            onupdatefiles={fileItems => {
                                // Set currently active file objects to this.state
                                this.setState({
                                    files: fileItems.map(fileItem => fileItem.file)
                                });
                            }}
                        />

                        <Form.Group title="Technique">
                            <Form.Label column={2}>Technique</Form.Label>
                            <div className="upload-checks">
                                <Form.Check
                                    inline
                                    label="Dirty Pour"
                                    id="upload-radio1"
                                    onChange={this.updateInput}
                                    value={this.state.dirty}
                                    name="dirty"
                                    type="checkbox"
                                />
                                <Form.Check
                                    inline
                                    label="Flip Cup"
                                    id="upload-radio2"
                                    onChange={this.updateInput}
                                    value={this.state.flip}
                                    name="flip"
                                    type="checkbox"
                                />
                                <Form.Check
                                    inline
                                    label="Balloon Technique"
                                    id="upload-radio3"
                                    onChange={this.updateInput}
                                    value={this.state.balloon}
                                    name="balloon"
                                    type="checkbox"
                                />
                                <Form.Check
                                    inline
                                    label="Dutch pour"
                                    id="upload-radio4"
                                    onChange={this.updateInput}
                                    value={this.state.dutch}
                                    name="dutch"
                                    type="checkbox"
                                />
                                <Form.Check
                                    inline
                                    label="Colander"
                                    id="upload-radio5"
                                    onChange={this.updateInput}
                                    value={this.state.colander}
                                    name="colander"
                                    type="checkbox"
                                />
                                <Form.Check
                                    inline
                                    label="Hairdryer"
                                    id="upload-radio6"
                                    onChange={this.updateInput}
                                    value={this.state.hairdryer}
                                    name="hairdryer"
                                    type="checkbox"
                                />
                                <Form.Check
                                    inline
                                    label="Blowtorch"
                                    id="upload-radio7"
                                    onChange={this.updateInput}
                                    value={this.state.blowtorch}
                                    name="blowtorch"
                                    type="checkbox"
                                />
                            </div>
                        </Form.Group>

                        <Form.Group title="Add-Ons">
                            <Form.Label className="form-label" column={2}>Additional Materials</Form.Label>
                            <div className="upload-checks">
                                <Form.Check
                                    inline
                                    label="Floetrol"
                                    id="upload-radio8"
                                    onChange={this.updateInput}
                                    value={this.state.floetrol}
                                    name="floetrol"
                                    type="checkbox"
                                />
                                <Form.Check
                                    inline
                                    label="Silicone"
                                    id="upload-radio9"
                                    onChange={this.updateInput}
                                    value={this.state.silicone}
                                    name="silicone"
                                    type="checkbox"
                                />
                                <Form.Check
                                    inline
                                    label="Liquitex"
                                    id="upload-radio10"
                                    onChange={this.updateInput}
                                    value={this.state.liquitex}
                                    name="liquitex"
                                    type="checkbox"
                                />
                                <Form.Check
                                    inline
                                    label="Other"
                                    id="upload-radio11"
                                    onChange={this.updateInput}
                                    value={this.state.other}
                                    name="other"
                                    type="checkbox"
                                />
                            </div>
                        </Form.Group>
                        <Button disabled={!this.state.isSignedIn} className="submit-button-upload" label="Submit"
                                type="submit" size="lg" variant="outline-warning" value="Submit">Submit</Button>
                    </Form>
                    :
                    <div className="login-warning">
                        <p className="message">Please log in to upload paintings.</p>
                        <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()} id="login"/>
                    </div>
                }
            </div>
        )
    }
}

export default UploadPage;