import React, { Component } from "react";
import Axios from "axios";
import { Table, Button, Heading } from "evergreen-ui";
import { Link } from "react-router-dom";

// Axios config
Axios.defaults.baseURL = process.env.REACT_APP_SERVER;
Axios.defaults.withCredentials = true;

export default class Admin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      forms: [],
    };
  }

  async componentDidMount() {
    try {
      await Axios.get("/checkLoggedIn");
      let forms = await Axios.get("/fetchForms");
      if (forms.status === 200) {
        console.log(forms.data);
        this.setState({ forms: forms.data });
      } else {
        window.location.href = "/login?status=false";
      }
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    let { forms } = this.state;
    return (
      <div className="admin-container">
        <Heading size={500} margin="default">
          Created Forms
        </Heading>
        <Table className="submissions-table">
          <Table.Head>
            <Table.TextHeaderCell flexBasis={300} flexShrink={0} flexGrow={0}>
              Test ID
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>Test Title</Table.TextHeaderCell>
            <Table.TextHeaderCell></Table.TextHeaderCell>
            <Table.TextHeaderCell></Table.TextHeaderCell>
          </Table.Head>
          <Table.Body>
            {forms.map((form, ind) => {
              return (
                <Table.Row key={ind}>
                  <Table.TextCell flexBasis={300} flexShrink={0} flexGrow={0}>
                    {form.id}
                  </Table.TextCell>
                  <Table.TextCell>{form.title}</Table.TextCell>
                  <Table.TextCell>
                    <Link to={`/admin/edit/${form.id}`}>
                      <Button appearance="minimal">Edit</Button>
                    </Link>
                  </Table.TextCell>
                  <Table.TextCell>
                    <Link to={`/admin/submissions/${form.id}`}>
                      <Button appearance="minimal">Submissions</Button>
                    </Link>
                  </Table.TextCell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
        <Link to="/admin/create">
          <Button appearance="primary" marginTop="10px" marginBottom="10px">
            Create Form
          </Button>
        </Link>
      </div>
    );
  }
}
