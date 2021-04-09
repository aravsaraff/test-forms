import React, { Component } from "react";
import Axios from "axios";
import { Button, toaster } from "evergreen-ui";
import "./Admin.scss";

// Axios config
Axios.defaults.baseURL = process.env.REACT_APP_SERVER;
Axios.defaults.withCredentials = true;

function Question(props) {
  let { currentIndex, answers, field } = props;
  console.log(answers[currentIndex]);

  if (field.type === "single") {
    return (
      <div id="single" className="form-pane" key={currentIndex}>
        <div className="question">{field.question}</div>

        <div className="option">
          <input
            type="radio"
            id="op1"
            value="0"
            name={field.question}
            checked={answers[currentIndex][0]}
            readOnly
          />
          <label htmlFor="op1">{field.options[0]}</label>
        </div>

        <div className="option">
          <input
            type="radio"
            id="op2"
            value="1"
            name={field.question}
            checked={answers[currentIndex][1]}
            readOnly
          />
          <label htmlFor="op2">{field.options[1]}</label>
        </div>

        <div className="option">
          <input
            type="radio"
            id="op3"
            value="2"
            name={field.question}
            checked={answers[currentIndex][2]}
            readOnly
          />
          <label htmlFor="op3">{field.options[2]}</label>
        </div>

        <div className="option">
          <input
            type="radio"
            id="op4"
            value="3"
            name={field.question}
            checked={answers[currentIndex][3]}
            readOnly
          />
          <label htmlFor="op4">{field.options[3]}</label>
        </div>
      </div>
    );
  } else if (field.type === "multiple") {
    return (
      <div id="multiple" className="form-pane" key={currentIndex}>
        <div className="question">{field.question}</div>

        <div className="option">
          <input
            type="checkbox"
            id="op1"
            value="0"
            name="op1"
            checked={answers[currentIndex][0]}
            readOnly
          />
          <label htmlFor="op1">{field.options[0]}</label>
        </div>

        <div className="option">
          <input
            type="checkbox"
            id="op2"
            value="1"
            name="op2"
            checked={answers[currentIndex][1]}
            readOnly
          />
          <label htmlFor="op2">{field.options[1]}</label>
        </div>

        <div className="option">
          <input
            type="checkbox"
            id="op3"
            value="2"
            name="op3"
            checked={answers[currentIndex][2]}
            readOnly
          />
          <label htmlFor="op3">{field.options[2]}</label>
        </div>

        <div className="option">
          <input
            type="checkbox"
            id="op4"
            value="3"
            name="op4"
            checked={answers[currentIndex][3]}
            readOnly
          />
          <label htmlFor="op4">{field.options[3]}</label>
        </div>
      </div>
    );
  } else {
    return (
      <div id="subjective" className="form-pane" key={props.currentIndex}>
        <div className="question">{field.question}</div>

        <input
          type="text"
          id="answer"
          value={
            typeof answers[currentIndex] === "object"
              ? ""
              : answers[currentIndex]
          }
          readOnly
        />
        <form id="subjective-marking" onSubmit={props.handleMarks}>
          <input type="number" name="marks" id="marks" />
          <input type="submit" value="Award" />
        </form>
      </div>
    );
  }
}

export default class Checking extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.match.params.id,
      user: this.props.match.params.user,
      form: [],
      currentIndex: 0,
      answers: [],
      message: "",
      validId: false,
    };
  }

  decrementIndex = (e) => {
    try {
      e.preventDefault();
      let { currentIndex } = this.state;
      if (currentIndex > 0)
        this.setState({ currentIndex: this.state.currentIndex - 1 });
      console.log(this.state.currentIndex);
    } catch (err) {
      console.log(err);
    }
  };

  incrementIndex = (e) => {
    try {
      e.preventDefault();
      let { currentIndex, form } = this.state;
      if (currentIndex < form.fields.length - 1)
        this.setState({ currentIndex: this.state.currentIndex + 1 });
    } catch (err) {
      console.log(err);
    }
  };

  async componentDidMount() {
    try {
      const response = await Axios.get("/checkLoggedIn");
      if (response.status !== 200) {
        window.location.href = "/login?status=false";
      }
      let resp = await Axios.post("/fetchUserResultsAdmin", {
        id: this.state.id,
        user: this.state.user,
      });
      console.log(resp.data);
      if (resp.status === 200) {
        this.setState({
          form: resp.data.form,
          answers: resp.data.results.answer,
          validId: true,
        });
      }
      console.log(this.state);
    } catch (err) {
      console.log(err);
    }
  }

  handleMarks = async (e) => {
    try {
      e.preventDefault();
      let marksAwarded = e.target.marks.value;
      console.log(marksAwarded);
      let resp = await Axios.post("/subjectiveMarking", {
        id: this.state.id,
        user: this.state.user,
        marks: marksAwarded,
      });
      console.log(resp.data);
      if (resp.status === 200) {
        toaster.success(resp.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  markChecked = async (e) => {
    try {
      e.preventDefault();
      let resp = await Axios.post("/markChecked", {
        id: this.state.id,
        user: this.state.user,
      });
      console.log(resp);
      if (resp.status === 200) {
        toaster.success(resp.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    let { form, currentIndex, answers } = this.state;
    return (
      <div className="form-container">
        <div className="meta">
          <h1>{form.title}</h1>
          <h3>{form.description}</h3>
          {/* <p>{message}</p> */}
        </div>
        {form.fields && (
          <div>
            <Question
              currentIndex={currentIndex}
              field={form.fields[currentIndex]}
              answers={answers}
              handleMarks={this.handleMarks}
            />
            <Button appearance="minimal" onClick={this.decrementIndex}>
              Prev
            </Button>
            <Button appearance="minimal" onClick={this.incrementIndex}>
              Next
            </Button>
            <Button appearance="primary" onClick={this.markChecked}>
              Mark Form Checked
            </Button>
          </div>
        )}
      </div>
    );
  }
}
