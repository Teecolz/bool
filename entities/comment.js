class Comment {
  constructor(text) {
    this.text = text;
  }

  toString() {
    return `(Comment "${this.text}")`;
  }
}

module.exports = Comment;
