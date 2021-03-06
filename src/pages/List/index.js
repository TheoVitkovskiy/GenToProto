import React, { Component } from 'react';

import { createGentoFactoryInstance, createAuctionTokenInstance } from 'contractInstances';

import View from './View';

import moment from 'moment';

class Home extends Component {
  
  constructor() {
    super();
    
    this.state = {
      items: [],
    }
  }

  componentDidMount() {
    this.listIcos();
  }
  
  componentDidUpdate(nextProps) {
    if (nextProps.account !== this.props.account) {
      this.setState({
        items: []
      }, this.listIcos())
    }
  }

  addIcoEntry = (address) => {
    const instance = createAuctionTokenInstance(address);
    
    instance.getDetails((err, result) => {
      if(err) {
        console.error(err);
        return;
      } else {
        const creationDate = result[4].toNumber();
        const name = result[1];
        const date = moment.unix(creationDate).format('LL');
        
        const item = {
          address: address,
          name: name,
          date: date
        }

        let hasAddress = this.state.items.some( item => item['address'] === address )

        if(!hasAddress) {
          const newItems = this.state.items;
          newItems.push(item);
          this.setState({
            items: newItems
          })
        }
      }
    })
  }

  listIcos = () => {
    const owner = this.props.account;
    const instance = createGentoFactoryInstance();

    instance.getICOsFromOwner(owner, (err, res) => {
      if(err) {
        console.error(err);
      }
      for(let x = 0; x < res.length; x++) {
        this.addIcoEntry(res[x]);
      }
    })
  }

  render() {
    return (
      <View
        {...this.props}
        {...this.state}
      />
    );
  }
}

export default Home;
