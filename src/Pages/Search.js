import React, {Component} from 'react';
import Button from 'react-bootstrap/Button';
import ButtonToolbar from "react-bootstrap/esm/ButtonToolbar";
import Dropdown from "react-bootstrap/esm/Dropdown";
import {LinkContainer} from 'react-router-bootstrap';
import Card from "react-bootstrap/Card";
import {db} from "../firebase";
import Badge from 'react-bootstrap/Badge'

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            paintings: [],
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
        };

        db.settings({
            timestampsInSnapshots: true
        });
        db.collection('paintings').get().then((querySnapshot) => {
            let artList = [];
            querySnapshot.forEach((doc) => {
                console.log(doc.data());
                artList.push(doc.data());
            });

            this.setState({paintings: artList});
        });
    }

    updatePaintings() {
        let query = db.collection('paintings');
        if (this.state.dirty) {
            query = query.where("dirty", "==", true);
        }
        if (this.state.floetrol) {
            query = query.where("floetrol", "==", true);
        }
        if (this.state.dutch) {
            query = query.where("dutch", "==", true);
        }
        if (this.state.other) {
            query = query.where("other", "==", true);
        }
        if (this.state.flip) {
            query = query.where("flip", "==", true);
        }
        if (this.state.silicone) {
            query = query.where("silicone", "==", true);
        }
        if (this.state.colander) {
            query = query.where("colander", "==", true);
        }
        if (this.state.balloon) {
            query = query.where("balloon", "==", true);
        }
        if (this.state.hairdryer) {
            query = query.where("hairdryer", "==", true);
        }
        if (this.state.liquitex) {
            query = query.where("liquitex", "==", true);
        }
        if (this.state.blowtorch) {
            query = query.where("blowtorch", "==", true);
        }
        query.get().then(this.onFirebaseUpdate.bind(this))
    }

    onFirebaseUpdate(querySnapshot) {
        let artList = [];
        querySnapshot.forEach((doc) => {
            console.log(doc.data());
            artList.push(doc.data());
        });
        this.setState({paintings: artList});
    }

    onDirtyClick = () => {
        this.setState({dirty: !this.state.dirty}, this.updatePaintings);
    };

    onColanderClick = () => {
        this.setState({colander: !this.state.colander}, this.updatePaintings);
    };

    onBalloonClick = () => {
        this.setState({balloon: !this.state.balloon}, this.updatePaintings);
    };

    onDutchClick =() => {
        this.setState({dutch: !this.state.dutch}, this.updatePaintings);
    };

    onFloetrolClick = () => {
        this.setState({floetrol: !this.state.floetrol}, this.updatePaintings);
    };

    onSiliconeClick = () => {
        this.setState({silicone: !this.state.silicone}, this.updatePaintings);
    };

    onHairdryerClick = () => {
        this.setState({hairdryer: !this.state.hairdryer}, this.updatePaintings);
    };

    onLiquitexClick = () => {
        this.setState({liquitex: !this.state.liquitex}, this.updatePaintings);
    };

    onFlipClick = () => {
        this.setState({flip: !this.state.flip}, this.updatePaintings);
    };

    onBlowtorchClick = () => {
        this.setState({blowtorch: !this.state.blowtorch}, this.updatePaintings);
    };

    onOtherClick = () => {
        this.setState({other: !this.state.other}, this.updatePaintings);
    };

    render() {
        return (
            <div>
                <ButtonToolbar>
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic" title="Filter" className="filter-button">Filter
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={this.onDutchClick} as="button">Dutch pour</Dropdown.Item>
                            <Dropdown.Item onClick={this.onBalloonClick} as="button">Balloon Technique</Dropdown.Item>
                            <Dropdown.Item onClick={this.onColanderClick} as="button">Colander</Dropdown.Item>
                            <Dropdown.Item onClick={this.onHairdryerClick} as="button">Hairdryer</Dropdown.Item>
                            <Dropdown.Item onClick={this.onSiliconeClick} as="button">Silicone</Dropdown.Item>
                            <Dropdown.Item onClick={this.onLiquitexClick} as="button">Liquitex</Dropdown.Item>
                            <Dropdown.Item onClick={this.onDirtyClick} as="button">Dirty Pour</Dropdown.Item>
                            <Dropdown.Item onClick={this.onFloetrolClick} as="button">Floetrol</Dropdown.Item>
                            <Dropdown.Item onClick={this.onFlipClick} as="button">Flip Cup</Dropdown.Item>
                            <Dropdown.Item onClick={this.onBlowtorchClick} as="button">Blowtorch</Dropdown.Item>
                            <Dropdown.Item onClick={this.onOtherClick} as="button">Other</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>


                    <LinkContainer exact to="/uploads">
                        <Button className="upload-button" variant="primary">Upload</Button>
                    </LinkContainer>
                </ButtonToolbar>

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
                        </Card>
                    ))}
                </div>
            </div>
        )
    }
}

export default Search;