import React, {Component} from 'react';
import firebase from 'firebase';
import {db} from "../firebase";
import Card from "react-bootstrap/Card";
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';

class PersonalUploads extends Component {
    constructor(props) {
        super(props);
        this.state = {
            paintings: [],
            isSignedIn: false,
        }
    }

    deletePainting = (id) => {
        db.collection("paintings").doc(id).delete().then(function() {
            console.log("Document removed successfully!");
        }).catch(function(error) {
            console.error("Error removing document: ", + id, error);
        })
    };

    componentDidMount() {
        firebase.auth().onAuthStateChanged(
            (user) => {
                this.setState({isSignedIn: !!user});
                if (!!user) {
                    db.settings({
                        timestampsInSnapshots: true
                    });
                    db.collection('paintings').where("uid", "==", user.uid).get().then((querySnapshot) => {
                        let artList = [];
                        querySnapshot.forEach((doc) => {
                            let painting = doc.data();
                            painting.id = doc.id;
                            artList.push(painting);
                        });

                        this.setState({paintings: artList});
                    });
                }
            });
    }

    render() {
        return (
            <div className="painting-container">
                {this.state.paintings.map((painting, index) => (
                    <Card key={index}>
                        <Card.Img variant="right" src={painting.image} className="painting-thumbnail rounded"/>
                        <Card.Footer className="badge-wrapper">
                            {painting.dirty ?
                                <Badge className="badge" pill variant="dark">Dirty Pour</Badge> :
                                <div></div>
                            }
                            {painting.dutch ?
                                <Badge className="badge" pill variant="success">Dutch Pour</Badge> :
                                <div></div>
                            }
                            {painting.flip ?
                                <Badge className="badge" pill variant="info">Flip Cup</Badge> :
                                <div></div>
                            }
                            {painting.floetrol ?
                                <Badge className="badge" pill variant="primary">Floetrol</Badge> :
                                <div></div>
                            }
                            {painting.colander ?
                                <Badge className="badge" pill variant="secondary">Colander</Badge> :
                                <div></div>
                            }
                            {painting.silicone ?
                                <Badge className="badge" pill variant="info">Silicone</Badge> :
                                <div></div>
                            }
                            {painting.hairdryer ?
                                <Badge className="badge" pill variant="success">Hairdryer</Badge> :
                                <div></div>
                            }
                            {painting.balloon ?
                                <Badge className="badge" pill variant="primary">Balloon Technique</Badge> :
                                <div></div>
                            }
                            {painting.liquitex ?
                                <Badge className="badge" pill variant="dark">Liquitex</Badge> :
                                <div></div>
                            }
                            {painting.blowtorch ?
                                <Badge className="badge" pill variant="danger">Blowtorch</Badge> :
                                <div></div>
                            }
                            {painting.other ?
                                <Badge className="badge" pill variant="danger">Other</Badge> :
                                <div></div>
                            }
                        </Card.Footer>
                        <Button onClick={() => this.deletePainting(painting.id)} className="delete-button" variant="danger">Delete</Button>
                    </Card>
                ))}
            </div>
        );
    }
}

export default PersonalUploads;