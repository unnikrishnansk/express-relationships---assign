const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

const connect = () => {
  return mongoose.connect(
    "mongodb+srv://dhaval:dhaval_123@cluster0.ljuvz.mongodb.net/web15-atlas?retryWrites=true&w=majority"
  );
};

const sectionSchema = new mongoose.Schema(
  {
    sectionName: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Section = mongoose.model("section", sectionSchema); 

const bookSchema = new mongoose.Schema(
  {
    bookName: { type: String, required: true },
    body: { type: String, required: true },
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref : "section",
      required: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref : "author",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model("book", bookSchema);

const authorSchema = new mongoose.Schema(
  {
    FirstName: { type: String, required: true },
    SecondName: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Author = mongoose.model("author", authorSchema);

const checkedOut = new mongoose.Schema(
  {
    checkedOutTime : {type : Boolean, required:true},
    checkedInTime : {type : Boolean, required:true},
    bookId : {
      type :  mongoose.Schema.Types.ObjectId,
      ref : "book",
      required: true,
    }
  },
  {
    timestamps : true,
  }
);


app.get("/author", async (req, res) => {
  try {
    const author = await Author.find().lean().exec();

    return res.status(200).send({ author: author });
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Something went wrong .. try again later" });
  }
});

app.get("/section", async (req, res) => {
  try {
    const section = await Section.create(req.body);

    return res.status(201).send(section);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});


app.get("/section", async (req, res) => {
  try {
    const section = await Section.findById(req.params.id).lean().exec();
    if(checkedOutTime==false && checkedInTime==true)
    {
    return res.status(200).send(section);
    }
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

app.get("/section", async (req, res) => {
  try {
    const section = await Section.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .lean()
      .exec();

    return res.status(200).send(section);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

app.get("/checkedOut", async (req, res) => {
  try {
    const checkedOut = await checkedOut.findByIdAndDelete(req.params.id).lean().exec();
    if(checkedOutTime==true)
    {
    return res.status(200).send(checkedOut);
    }
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});


app.listen(5001, async () => {
  try {
    await connect();
  } catch (err) {
    console.log(err);
  }

  console.log("listening on port 5001");
});
