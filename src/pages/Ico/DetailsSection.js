import React, { Component } from 'react';

import { Grid, Header, Segment, Progress } from 'semantic-ui-react';
import moment from 'moment';

let auctionInterval;

const tokenPriceIncrease = 'The token price will <strong>increase</strong> from <strong>1000</strong> to <strong>10000</strong> finney'

class DetailsSection extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            timeCountDown: '',
            currentPercentage: null,
            supplyObj: { }
        }
    }

    setAuctionTimer = () => {
    const { details, status } = this.props;
    let timeCountDown;
    console.log(details);

    if(status === "pending") {
        timeCountDown = "Auction will start at " + moment.unix(details._saleStart).format('LLL');
    } else if (status === "running") {
        const endTime = moment.unix(details._saleEnd);
        let duration = moment.duration(endTime.diff(moment()));
        const interval = 1000;

        timeCountDown = duration.days() + " d " + duration.hours() + " h " + duration.minutes() + " m " + duration.seconds() + " s left";

        auctionInterval = setInterval(() => {
            if(endTime.diff(moment()) < 0) {
                this.setAuctionTimer();
            }
            duration = moment.duration(duration - interval);
            timeCountDown = duration.days() + " d " + duration.hours() + " h " + duration.minutes() + " m " + duration.seconds() + " s left";
            let currentPercentage = ((endTime.diff(moment()) / endTime.diff(moment.unix(details._saleStart))) * 100).toFixed(2);
            console.log(currentPercentage);
            this.setState({
                timeCountDown,
                currentPercentage
            })
        }, interval)
    }
}

    componentWillMount() {
        this.setAuctionTimer();
        this.props.setSupplyInterval((obj) => {
            this.setState({
                supplyObj: obj
            })
        });
        
    }

    render() {
        const { details, status } = this.props;
        return (
            <Grid>
            <Grid.Row>
                <Grid.Column width={8}>
                    <Header as='h2' attached textAlign='left'>
                        Token Name
                    </Header>
                    <Segment attached padded raised textAlign='left' color='olive'>
                        {this.props.details._name}
                    </Segment>
                </Grid.Column>
                <Grid.Column width={8}>
                    <Header as='h2' attached textAlign='right'>
                        Created at
                    </Header>
                    <Segment attached padded raised textAlign='right' color='olive'>
                        {moment.unix(details._creationDate).format('LLL')}
                    </Segment>
                </Grid.Column>
            </Grid.Row>
    
            <Grid.Row>
                <Grid.Column width={8}>
                    <Header as='h2' attached textAlign='left'>
                        Ticker Symbol
                    </Header>
                    <Segment attached padded raised textAlign='left' color='olive'>
                        {this.props.details._symbol}
                    </Segment>
                </Grid.Column>
                <Grid.Column width={8}>
                    <Header as='h2' attached textAlign='right'>
                        Owned By
                    </Header>
                    <Segment attached padded raised textAlign='right' color='olive'>
                        {details._owner}
                    </Segment>
                </Grid.Column>
            </Grid.Row>
    
            <Grid.Row>
                <Grid.Column width={8}>
                    <Header as='h2' attached textAlign='left'>
                        Number of Tokens
                    </Header>
                    <Segment attached padded raised textAlign='left' color='olive'>
                        <Progress percent={this.state.supplyObj.supplyPct} indicating progress label={this.state.supplyObj.supplyString} />
                    </Segment>
                </Grid.Column>
                <Grid.Column width={8}>
                    <Header as='h2' attached textAlign='right'>
                        Period of Auction
                    </Header>
                    <Segment attached padded raised textAlign='right' color='olive'>
                        <Progress percent={this.state.currentPercentage} indicating progress label={this.state.timeCountDown} />
                    </Segment>
                </Grid.Column>
            </Grid.Row>
    
            <Grid.Row>
                <Grid.Column>
                    <Header as='h2' attached textAlign='center'>
                        Price over time
                    </Header>
                    <Segment attached padded textAlign='center' color='olive'>
                        <div dangerouslySetInnerHTML={{__html: this.props.priceDevelopmentString}}></div>
                    </Segment>
                </Grid.Column>
            </Grid.Row>
        </Grid>
        )
    }
}

export default DetailsSection;