import React, { Component } from "react";
import API from "./api";
import ReactTable from "react-table";
import "react-table/react-table.css";

class App extends Component {
  state = {
    employees: []
  }

  componentDidMount() {
   
    API.search().then(({data:{results}}) => {

        let employees = results.map(person => {
          return {
            id: person.id.value || "N/A",
            name: person.name.first + person.name.last,
            city: person.location.city,
            email: person.email,
            phone: person.phone,
            website: person.picture.thumbnail
          }
        })
        this.setState({ employees })
      })
  }

  deleteRow(id) {
    const index = this.state.employees.findIndex(user => {
      return user.id === id
    });
  }

  render() {

    const columns = [
      {
        Header: "Picture",
        Cell: properties => {
          return (<img src={properties.value}/>)
        },
        accessor: "website",
        style: { textAlign: "center" }
      },
      {
        Header: "Name",
        accessor: "name",
        filterable: true,
        textAlign: "center",
        style: { textAlign: "center" }
      },
      {
        Header: "Email",
        accessor: "email",
        style: { textAlign: "center" },
      },
      {
        Header: "Phone",
        accessor: "phone",
        style: { textAlign: "center" },
      },
      {
        Header: "Location",
        accessor: "city",
        style: { textAlign: "center" },
      }
    ]

    return (
      <ReactTable
        columns={columns}
        data={this.state.employees}
        showPaginationTop
      >
      </ReactTable>
    );
  }
}

export default App;




