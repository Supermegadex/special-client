import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  name;
  answer;
  token;
  question;
  hideQ = false;
  loading = false;
  loadingDots = '';
  nameEntered = false;
  // url = 'https://supermegadex-special.now.sh';
  url = 'http://localhost:3000';

  constructor() {
    const currentToken = localStorage.getItem('token');
    if (currentToken) {
      this.token = currentToken;
    }
  }

  loadUpdate() {
    if (this.loading) {
      this.loadingDots = this.loadingDots.split('').concat([(() => {
        let punc = '.';
        switch (this.loadingDots.length) {
          case 20:
            punc = ',';
            break;
          case 35:
            punc = '!';
            break;
          case 49:
            punc = ':';
            break;
          case 50:
            punc = ')';
            break;
          default:
            break;
        }
        return punc;
      })()]).join('');
      setTimeout(() => this.loadUpdate(), 250);
    } else {
      this.loadingDots = '';
    }
  }

  runActions(actions) {
    console.log(actions);
    for (let action of actions) {
      switch (action) {
        case 'restart':
          break;
        default:
          break;
      }
    }
  }

  getCurrentQuestion() {
    this.loading = true;
    this.loadUpdate();
    fetch(this.url, {
      body: JSON.stringify({
        name: this.name,
        token: this.token,
        ask: true
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      mode: 'cors'
    }).then(data => data.json())
      .then(d => {
        this.loading = false;
        this.runActions(d.actions);
        this.updateToken(d.token);
        this.question = d.question;
      })
      .catch(err => console.error(err));
  }

  start() {
    this.nameEntered = true;
    this.getCurrentQuestion();
  }

  updateToken(token) {
    localStorage.setItem('token', token);
    this.token = token;
  }

  submitAnswer() {
    this.loading = true;
    this.loadUpdate();
    fetch(this.url, {
      body: JSON.stringify({
        name: this.name,
        token: this.token,
        ask: false,
        answer: this.answer
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      mode: 'cors'
    }).then(data => data.json())
      .then(d => {
        this.loading = false;
        if (d.correct) {
          this.updateToken(d.token);
          this.runActions(d.actions);
          this.question = d.nextQuestion;
        }
      })
      .catch(err => console.error(err));
  }
}
