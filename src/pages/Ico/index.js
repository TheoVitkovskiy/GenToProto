import React, { Component } from 'react';

import { createAuctionTokenInstance } from 'contractInstances';

import View from './View';

import web3 from 'myWeb3';
import moment from 'moment';

class Ico extends Component {

    constructor() {
        super();

        this.state = {
            unit: 'finney',
            status: null,
            auctionType: null,
            buyPriceStart: null,
            buyPriceEnd: null,
            auctionDetails: null,
            auctionDetailsParsed: null,
            tokenCount: 0,
            tokenCountMsg: null,
            accountChanged: false,
            priceDevelopmentString: null,
            currentPercentage: null,
            timeCountDown: null
        }
    }

    componentWillMount() {
        let contractAddress = this.props.match.params.address;
        if (contractAddress) {
            if (web3.isAddress(contractAddress)) {
                this.getContractDetails(contractAddress);
            } else {
                console.log('Not a valid ethereum address: ' + contractAddress);
            }
        } else {
            console.log('Missing address parameter');
        }
    }

    componentDidUpdate(nextProps) {
        if(nextProps.account !== this.props.account) {
            this.setMyTokenCount();
        }
    }

    setMyTokenCount = () => {
        this.checkSupply(this.props.account, (err, res) => {
            let msg;
            if(err) {
                msg = "Pending...";
            } else {
                let amount = res.toNumber();
                this.setState({
                    tokenCount: amount
                });
                msg = "You own <strong>" + amount + " </strong>" + this.state.auctionDetails._symbol + " <strong>(=" + (amount * 100 / this.state.auctionDetails._totalSupply).toFixed(2) + "%)</strong> "
            }
            this.setState({
                tokenCountMsg: msg
            })
        })
    }

    checkSupply = (address, callback) => {
        const instance = createAuctionTokenInstance(this.props.match.params.address);
        instance.balanceOf(address, (error, result) => {
            if(error) {
                callback(error);
            } else {
                callback(null, result);
            }
        })
    }

    getCurrentStatus = (data) => {
        const start = moment.unix(data._saleStart);
        const end = moment.unix(data._saleEnd);
        const now = moment();
        if(now.diff(start) < 0) {
            return 'pending';
        } else if (now.diff(end) < 0){
            return 'running';
        } else {
            return 'over'
        }
    }

    getAuctionType = (data) => {
        if(data._buyPriceStart < data._buyPriceEnd) {
            return 'english';
        } else if (data._buyPriceStart > data._buyPriceEnd){
            return 'dutch';
        } else {
            return 'fixed';
        }
    }

    getPriceDevelopmentString = () => {
        const data = this.state.auctionDetails;
        let priceDev = "The token price ";
        if(this.state.auctionType === "dutch") {
            priceDev += "will <strong>decrease</strong> from <strong>" + this.state.buyPriceStart + "</strong> to <strong>" + this.state.buyPriceEnd + "</strong>";
        } else if(this.state.auctionType === "english") {
            priceDev += "will <strong>increase</strong> from <strong>" + this.state.buyPriceStart + "</strong> to <strong>" + this.state.buyPriceEnd + "</strong>";            
        } else {
            priceDev += "is <strong>" + this.state.buyPriceStart + "</strong>";
        }
        priceDev += " " + this.state.unit;
        return priceDev;
    }

    initAuctionDetails = (data) => {
        this.setState({
            auctionDetails: data,
            buyPriceStart: parseInt(web3.fromWei(data._buyPriceStart, this.state.unit), 10),
            buyPriceEnd: parseInt(web3.fromWei(data._buyPriceEnd, this.state.unit), 10),
            status: this.getCurrentStatus(data),
            auctionType: this.getAuctionType(data)
        })
    }

    setPriceDevelopmentString = () => {
        const msg = this.getPriceDevelopmentString();
        this.setState({
            priceDevelopmentString: msg
        })
    }

    parseContractDetails = (rawData) => {
        return {
            _owner: rawData[0],
            _name: rawData[1],
            _symbol: rawData[2],
            _totalSupply: rawData[3],
            _creationDate: rawData[4].toNumber(),
            _buyPriceStart: rawData[5].toNumber(),
            _buyPriceEnd: rawData[6].toNumber(),
            _sellPrice: rawData[7].toNumber(),
            _saleStart: rawData[8].toNumber(),
            _saleEnd: rawData[9].toNumber(),
        }
    }

    getContractDetails = (address) => {
        const instance = createAuctionTokenInstance(address);

        instance.getDetails((error, result) => {
            if(error) {
                console.error(result);
            } else {
                let data = this.parseContractDetails(result);
                this.setState({
                    auctionDetailsParsed: data,
                })
                this.initAuctionDetails(data);

                this.setPriceDevelopmentString();
            }
        })
    }

    setSupplyInterval = (cb) => {
        const data = this.state.auctionDetails;

        if (data) {
            this.checkSupply(data._owner, (err, supply) => {
                if(err) {
                    console.error(err);
                } else {
                    supply = supply.toNumber();
                    const supplyPct = (supply & data._totalSupply) * 100;
                    const supplyString = `${supply} of ${data._totalSupply} left for sale`;
                    cb({
                        supplyPct,
                        supplyString
                    });
                }
            })
        }    
    }

    render() {
        return(
            <View
                {...this.props}
                {...this.state}
                setSupplyInterval={this.setSupplyInterval}
            />
        )
    }
}

export default Ico;