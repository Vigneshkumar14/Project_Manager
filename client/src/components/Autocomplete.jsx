import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";

const Autocomplete = ({ change }) => {
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [userId, setUserId] = useState("");
  const [abortController, setAbortController] = useState(null);

  const handleInputChange = async (e) => {
    const newSearchText = e.target.value;

    setSearchText(newSearchText);

    if (newSearchText) {
      if (abortController) {
        abortController.abort();
      }
      const newAbortController = new AbortController();
      setAbortController(newAbortController);
      try {
        const result = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/defect/search/user/${searchText}`,
          { signal: newAbortController.signal, withCredentials: true }
        );

        if (result.data.success && result.data.userName.length > 0)
          setSuggestions(result.data.userName);
      } catch (err) {
        if (err.name !== "CanceledError") {
        }
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionSelect = (id, email) => {
    if (id && email) {
      setSuggestions([]);
      setSearchText(email);
      setUserId(id);
    }
  };
  const handleSave = (e) => {
    e.preventDefault();
    if (userId && searchText) {
      change(userId, searchText);
    }
    setSuggestions([]);
    setSearchText("");
    setUserId("");
  };
  useEffect(() => {
    return () => {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [abortController]);

  return (
    <Fragment>
      <div className="flex flex-row justify-around relative">
        <input
          className="rounded-sm  bg-slate-900 w-full caret-slate-900"
          placeholder=""
          value={searchText}
          onChange={handleInputChange}
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            change();
            setSearchText("");
            setSuggestions([]);
            setUserId("");
          }}
          className="bg-inputbg rounded-lg ml-2 w-10 h-10 flex flex-row items-center justify-center text-center"
        >
          <AiOutlineClose className="text-center" />
        </button>
        <button
          onClick={handleSave}
          className="bg-inputbg rounded-lg ml-2 w-10 h-10 flex flex-row items-center justify-center text-center"
        >
          <AiOutlineCheck className="text-center" />
        </button>
        {/* mt-8 ml-24 md:ml-2 */}
        <div className="absolute top-10 left-0 bg-slate-900 z-10 transform translate-y-2 border">
          {searchText.length > 0 && (
            <div>
              {suggestions.length > 0 &&
                suggestions.map((suggestion, index) => (
                  <div
                    className="!text-gray-300 flex flex-col hover:bg-slate-700 border-solid border-b"
                    key={suggestion._id}
                    onClick={() =>
                      handleSuggestionSelect(suggestion._id, suggestion.email)
                    }
                  >
                    <h1 className="text-left"> {suggestion.name}</h1>
                    <h1 className="text-right">{suggestion.email}</h1>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default Autocomplete;
