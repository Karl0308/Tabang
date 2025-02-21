import React from "react";
import { MentionsInput, Mention } from "react-mentions";

const style = {
  control: {
    fontSize: 15,
    backgroundColor: 'transparent', 
  },
  "&multiLine": {
    control: {
      minHeight: 40,
    },
    highlighter: {
      padding: 10,
      border: "2px solid transparent",
    },
    input: {
      padding: 10,
      borderRadius: 10,
    },
  },
  "&singleLine": {
    display: "inline-block",
    input: {
      padding: 1,
      border: "2px inset",
    },
  },
  suggestions: {
    list: {
      backgroundColor: "white",
      border: "1px solid #333",
      fontSize: 18,
      borderRadius: 10,
    },
    item: {
      padding: "10px 20px",
      "&focused": {
        color: "#0d6efd",
        backgroundColor: "transparent",
      },
    },
  }
};

function MentionInput({ userList, value, onChange }) {
  const [textAreaVal, setTextAreaVal] = React.useState("");

  const handleInputChange = (e) => {
    setTextAreaVal(e.target.value);
    // Call the onChange function if provided
    if (onChange) {
      onChange(e.target.value);
    }
  };

  const users = userList.map((user) => ({
    id: user.id,
    display: user.fullName,
  }));

  return (
      <MentionsInput
        className="flex w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
        style={style}
        value={value}
        onChange={handleInputChange}
      >
        <Mention
          data={users}
        />
      </MentionsInput>
  
  );
}

export default MentionInput;
