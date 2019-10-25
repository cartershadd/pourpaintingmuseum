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
            files: []
        };
        console.log(firebase.auth())
    }

    onSubmit = (e) => {
        e.preventDefault();
        console.log(this.state.image)
        if (this.state.image === '') {
            alert('Please select an image to upload.')
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

    render() {
        return (
            <Form className="upload-form" onSubmit={this.onSubmit}>
                <Form.Label className="form-label" column={1}>Upload Your Work Here!</Form.Label>
                <FilePond
                    ref={ref => (this.pond = ref)}
                    files={this.state.files}
                    allowMultiple={true}
                    maxFiles={3}
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
                    {['checkbox'].map(type => (
                        <div key={`inline-${type}`} className="upload-checks">
                            < Form.Check
                                inline
                                label="Dirty Pour"
                                id="upload-radio1"
                                onChange={this.updateInput}
                                value={this.state.dirty}
                            />
                            <Form.Check
                                inline
                                label="Flip Cup"
                                id="upload-radio2"
                                onChange={this.updateInput}
                                value={this.state.flip}
                            />
                            <Form.Check
                                inline
                                label="Balloon Technique"
                                id="upload-radio3"
                                onChange={this.updateInput}
                                value={this.state.balloon}
                            />
                            <Form.Check
                                inline
                                label="Dutch pour"
                                id="upload-radio4"
                                onChange={this.updateInput}
                                value={this.state.dutch}
                            />
                            <Form.Check
                                inline
                                label="Colander"
                                id="upload-radio5"
                                onChange={this.updateInput}
                                value={this.state.colander}
                            />
                            <Form.Check
                                inline
                                label="Hairdryer"
                                id="upload-radio6"
                                onChange={this.updateInput}
                                value={this.state.hairdryer}
                            />
                            <Form.Check
                                inline
                                label="Blowtorch"
                                id="upload-radio7"
                                onChange={this.updateInput}
                                value={this.state.blowtorch}
                            />
                        </div>
                    ))}
                </Form.Group>

                <Form.Group title="Add-Ons">
                    <Form.Label className="form-label" column={2}>Additional Materials</Form.Label>
                    {['checkbox'].map(type => (
                        <div key={`inline-${type}`} className="upload-checks">
                            <Form.Check
                                inline
                                label="Floetrol"
                                id="upload-radio8"
                                onChange={this.updateInput}
                                value={this.state.floetrol}
                            />
                            <Form.Check
                                inline
                                label="Silicone"
                                id="upload-radio9"
                                onChange={this.updateInput}
                                value={this.state.silicone}
                            />
                            <Form.Check
                                inline
                                label="Liquitex"
                                id="upload-radio10"
                                onChange={this.updateInput}
                                value={this.state.liquitex}
                            />
                            <Form.Check
                                inline
                                label="Other"
                                id="upload-radio11"
                                onChange={this.updateInput}
                                value={this.state.other}
                            />
                        </div>
                    ))}
                </Form.Group>
                <Button className="submit-button-upload" label="Submit" type="submit" size="lg" variant="outline-warning" value="Submit">Submit</Button>
            </Form>
        );
    }
}

export default UploadPage;