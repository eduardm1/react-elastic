import React, { Component } from "react";
import { render } from "react-dom";
import elasticsearch from "elasticsearch";
import './style.css';

let client = new elasticsearch.Client({
  host: "localhost:9200",
  log: "trace"
});

 class App extends Component {
  constructor(props) {
    super(props);

    this.state = { results: [] };
  }
  handleChange(event) {
    const search_query = event.target.value;

    client
      .search({
        q: search_query
      })
      .then(
        function (body) {
          this.setState({ results: body.hits.hits });
        }.bind(this),
        function (error) {
          console.trace(error.message);
        }
      );
  }


  render() {
    return (<div>
        <input type="text" placeholder="Autocomplete search" onChange={this.handleChange.bind(this)} />
        <SearchResults results={this.state.results} />
      </div>);
  }
}

class SearchResults extends Component {
  handleOrderClicked(event) {
    event.currentTarget.classList.toggle('active');
  }
  render() {
    const results = this.props.results || [];

    return (
      <div className="search_results">
        <hr />
        <ul>
          Order ID, Date and Customer Name:
          {results.map(result => {
          return (
            <div className="orders" onClick={this.handleOrderClicked} key={result._id}>
              {result._source.OrderId} | {result._source.Date} | {result._source.Customer.Name}
              <span className="orderDetail"> | {result._source.Customer.Email}</span>
            </div>
          );
        })}
        </ul>
      </div>
    );
  }
}


export default App