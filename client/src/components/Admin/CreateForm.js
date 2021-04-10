import React, { Component } from "react";
import Axios from "axios";
import Datetime from "react-datetime";
import { toaster } from "evergreen-ui";
import "./CreateForm.scss";

// Axios config
Axios.defaults.baseURL = process.env.REACT_APP_SERVER;

export default class CreateForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: "",
      title: "",
      description: "",
      formFields: [],
      start: null,
      end: null,
      positive: null,
      negative: null,
    };
  }
  async componentDidMount() {
    try {
      const data = await Axios.get("/checkLoggedIn");
      //   let forms = await Axios.get("/fetchForms");
      if (data.status !== 200) {
        window.location.href = "/login?status=false";
      }
    } catch (err) {
      console.log(err);
    }
  }

  editSingle = (e, ind) => {
    e.preventDefault();

    let editedQ = {
      type: "single",
      question: e.target.question.value,
      options: [
        e.target.single_option1.value,
        e.target.single_option2.value,
        e.target.single_option3.value,
        e.target.single_option4.value,
      ],
      answer: [
        e.target.option1.checked,
        e.target.option2.checked,
        e.target.option3.checked,
        e.target.option4.checked,
      ],
    };
    console.log(editedQ);
    let { formFields } = this.state;
    formFields[ind] = editedQ;
    this.setState({ formFields });
  };

  addSingle = (e) => {
    try {
      e.preventDefault();

      let addedQ = {
        type: "single",
        question: e.target.question.value,
        options: [
          e.target.single_option1.value,
          e.target.single_option2.value,
          e.target.single_option3.value,
          e.target.single_option4.value,
        ],
        answer: [
          e.target.option1.checked,
          e.target.option2.checked,
          e.target.option3.checked,
          e.target.option4.checked,
        ],
      };
      console.log(addedQ);
      this.setState((prevState) => ({
        formFields: [...prevState.formFields, addedQ],
      }));
    } catch (err) {
      console.log(err);
    }
  };

  editSubjective = (e, idx) => {
    e.preventDefault();
    let editedQ = {
      type: "subjective",
      question: e.target.question.value,
    };
    console.log(editedQ);
    let { formFields } = this.state;
    formFields[idx] = editedQ;
    this.setState({ formFields });
  };

  addSubjective = (e) => {
    try {
      e.preventDefault();
      let addedQ = {
        type: "subjective",
        question: e.target.question.value,
      };
      console.log(addedQ);
      this.setState((prevState) => ({
        formFields: [...prevState.formFields, addedQ],
      }));
    } catch (err) {
      console.log(err);
    }
  };

  editMultiple = (e, idx) => {
    e.preventDefault();
    let editedQ = {
      type: "multiple",
      question: e.target.question.value,
      options: [
        e.target.multiple_option1.value,
        e.target.multiple_option2.value,
        e.target.multiple_option3.value,
        e.target.multiple_option4.value,
      ],
      answer: [
        e.target.option1.checked,
        e.target.option2.checked,
        e.target.option3.checked,
        e.target.option4.checked,
      ],
    };
    console.log(editedQ);
    let { formFields } = this.state;
    formFields[idx] = editedQ;
    this.setState({ formFields });
  };

  addMultiple = (e) => {
    try {
      e.preventDefault();

      let addedQ = {
        type: "multiple",
        question: e.target.question.value,
        options: [
          e.target.multiple_option1.value,
          e.target.multiple_option2.value,
          e.target.multiple_option3.value,
          e.target.multiple_option4.value,
        ],
        answer: [
          e.target.option1.checked,
          e.target.option2.checked,
          e.target.option3.checked,
          e.target.option4.checked,
        ],
      };
      console.log(addedQ);
      this.setState((prevState) => ({
        formFields: [...prevState.formFields, addedQ],
      }));
    } catch (err) {
      console.log(err);
    }
  };

  handleMeta = (e) => {
    try {
      e.preventDefault();
      this.setState({
        id: e.target.id.value,
        title: e.target.title.value,
        description: e.target.description.value,
      });
    } catch (err) {
      console.log(err);
    }
  };

  setMarkingScheme = (e) => {
    e.preventDefault();
    this.setState({
      positive: e.target.positive.value,
      negative: e.target.negative.value,
    });
  };

  createForm = async (e) => {
    try {
      e.preventDefault();
      const resp = await Axios.post("/createForm", this.state);
      if (resp.status === 200) {
        console.log("Successfully created form.");
        toaster.success("Successfully created form.");
      }
    } catch (err) {
      console.log(err);
    }
  };

  deleteField = (idx) => {
    let { formFields } = this.state;
    formFields.splice(idx, 1);
    this.setState({ formFields });
  };

  render() {
    let { formFields } = this.state;
    return (
      <div className="main-container">
        <div className="created-form">
          <div className="created-form-meta">
            <div>
              ID: {this.state.id}
              <br />
            </div>
            <div>
              Title: {this.state.title}
              <br />
            </div>
            <div>
              Description: {this.state.description}
              <br />
            </div>
            <div>
              Postive: {this.state.positive}
              <br />
            </div>
            <div>
              Negative: {this.state.negative}
              <br />
            </div>
            <div>
              Start: {this.state.start?.toString()}
              <br />
            </div>
            <div>
              End: {this.state.end?.toString()}
              <br />
            </div>
          </div>
          <div className="created-form-questions">
            Questions <br />
            <ol>
              {formFields.map((ele, idx) => {
                if (ele.type === "single")
                  return (
                    <li>
                      <form
                        id="single-form"
                        onSubmit={(e) => this.editSingle(e, idx)}
                      >
                        <input
                          type="text"
                          name="question"
                          defaultValue={ele.question}
                        />
                        <div>
                          <input
                            type="radio"
                            id="option1"
                            name="correct"
                            defaultChecked={ele.answer[0]}
                          />
                          <input
                            type="text"
                            name="single_option1"
                            defaultValue={ele.options[0]}
                          />
                        </div>
                        <div>
                          <input
                            type="radio"
                            id="option2"
                            name="correct"
                            defaultChecked={ele.answer[1]}
                          />
                          <input
                            type="text"
                            name="single_option2"
                            defaultValue={ele.options[1]}
                          />
                        </div>
                        <div>
                          <input
                            type="radio"
                            id="option3"
                            name="correct"
                            defaultChecked={ele.answer[2]}
                          />
                          <input
                            type="text"
                            name="single_option3"
                            defaultValue={ele.options[2]}
                          />
                        </div>
                        <div>
                          <input
                            type="radio"
                            id="option4"
                            name="correct"
                            defaultChecked={ele.answer[3]}
                          />
                          <input
                            type="text"
                            name="single_option4"
                            defaultValue={ele.options[3]}
                          />
                        </div>
                        <div>
                          <input type="submit" value="Edit" />
                          <button
                            onClick={() => this.deleteField(idx)}
                            style={{ color: "red" }}
                          >
                            Delete
                          </button>
                        </div>
                      </form>
                    </li>
                  );
                else if (ele.type === "multiple")
                  return (
                    <li>
                      <form
                        id="multiple-form"
                        onSubmit={(e) => this.editMultiple(e, idx)}
                      >
                        <input
                          type="text"
                          name="question"
                          defaultValue={ele.question}
                        />
                        <div>
                          <input
                            type="checkbox"
                            name="option1"
                            defaultChecked={ele.answer[0] && "true"}
                          />
                          <input
                            type="text"
                            name="multiple_option1"
                            defaultValue={ele.options[0]}
                          />
                        </div>
                        <div>
                          <input
                            type="checkbox"
                            name="option2"
                            defaultChecked={ele.answer[1] && "true"}
                          />
                          <input
                            type="text"
                            name="multiple_option2"
                            defaultValue={ele.options[1]}
                          />
                        </div>
                        <div>
                          <input
                            type="checkbox"
                            name="option3"
                            defaultChecked={ele.answer[2] && "true"}
                          />
                          <input
                            type="text"
                            name="multiple_option3"
                            defaultValue={ele.options[2]}
                          />
                        </div>
                        <div>
                          <input
                            type="checkbox"
                            name="option4"
                            defaultChecked={ele.answer[3] && "true"}
                          />
                          <input
                            type="text"
                            name="multiple_option4"
                            defaultValue={ele.options[3]}
                          />
                        </div>
                        <div>
                          <input type="submit" value="Edit" />
                          <button
                            onClick={() => this.deleteField(idx)}
                            style={{ color: "red" }}
                          >
                            Delete
                          </button>
                        </div>
                      </form>
                    </li>
                  );
                else if (ele.type === "subjective")
                  return (
                    <li>
                      <form
                        id="subjective-form"
                        onSubmit={(e) => this.editSubjective(e, idx)}
                      >
                        <input
                          type="text"
                          name="question"
                          defaultValue={ele.question}
                        />
                        <div>
                          <input type="submit" value="Edit" />
                          <button
                            onClick={() => this.deleteField(idx)}
                            style={{ color: "red" }}
                          >
                            Delete
                          </button>
                        </div>
                      </form>
                    </li>
                  );
              })}
            </ol>
          </div>
        </div>
        <div className="form-fields">
          <form id="title-form" onSubmit={this.handleMeta}>
            Form Details:
            <input type="text" name="id" placeholder="Quiz Link" />
            <input type="text" name="title" placeholder="Quiz Title" />
            <input
              type="text"
              name="description"
              placeholder="Quiz Description"
            />
            <input type="submit" value="Set Title/Description" />
          </form>
          <form id="single-form" onSubmit={this.addSingle}>
            Single Correct Question:
            <input type="text" name="question" />
            <div>
              <input type="radio" id="option1" name="correct" />
              <input type="text" name="single_option1" />
            </div>
            <div>
              <input type="radio" id="option2" name="correct" />
              <input type="text" name="single_option2" />
            </div>
            <div>
              <input type="radio" id="option3" name="correct" />
              <input type="text" name="single_option3" />
            </div>
            <div>
              <input type="radio" id="option4" name="correct" />
              <input type="text" name="single_option4" />
            </div>
            <input type="submit" value="Add Single" />
          </form>

          <form id="multiple-form" onSubmit={this.addMultiple}>
            Multiple Correct Question:
            <input type="text" name="question" />
            <div>
              <input type="checkbox" name="option1" />
              <input type="text" name="multiple_option1" />
            </div>
            <div>
              <input type="checkbox" name="option2" />
              <input type="text" name="multiple_option2" />
            </div>
            <div>
              <input type="checkbox" name="option3" />
              <input type="text" name="multiple_option3" />
            </div>
            <div>
              <input type="checkbox" name="option4" />
              <input type="text" name="multiple_option4" />
            </div>
            <input type="submit" value="Add Multiiple" />
          </form>

          <form id="subjective-form" onSubmit={this.addSubjective}>
            Subjective Question:
            <input type="text" name="question" />
            <input type="submit" value="Add Subjective" />
          </form>

          <form id="marking-scheme" onSubmit={this.setMarkingScheme}>
            Marking Scheme:
            <input type="text" name="positive" placeholder="Positive" />
            <input type="text" name="negative" placeholder="Negative" />
            <input type="submit" value="Set marking scheme" />
          </form>
          <div className="time">
            Start time:
            <br />
            <br />
            <Datetime
              onChange={(value) => this.setState({ start: value.toDate() })}
            />
          </div>
          <div className="time">
            End time:
            <br />
            <br />
            <Datetime
              onChange={(value) => this.setState({ end: value.toDate() })}
            />
          </div>

          <button onClick={this.createForm} className="create-button">
            {" "}
            Create Form{" "}
          </button>
        </div>
      </div>
    );
  }
}
