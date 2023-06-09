import React, { Fragment, useEffect, useState } from "react";
import { Dropdown } from "flowbite-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [abortController, setAbortController] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const navigate = useNavigate();

  const handleSearchTextChange = async (e) => {
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
          `${process.env.REACT_APP_BASE_URL}/api/defect/search/${newSearchText}`,
          { signal: newAbortController.signal, withCredentials: true }
        );
        console.log(newSearchText, result);
        setToastMessage(result.data.message);
        setSuggestions(result.data.searchResult);
      } catch (err) {
        if (err.name !== "CanceledError") {
          setToastMessage(err.message);
        }
      }
    } else {
      setSuggestions("");
    }
  };

  const handleSuggestionSelect = (selectedSuggestion) => {
    if (String(selectedSuggestion).startsWith("DE-")) {
      navigate(`/defect/${selectedSuggestion}`);
      setSuggestions("");
      setSearchText("");
    }
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
      <input
        className="rounded-sm focus:outline-none py-1 bg-slate-900 border-b-2 border-gray-400"
        placeholder="Search"
        value={searchText}
        onChange={handleSearchTextChange}
      />

      {suggestions.length > 0 ? (
        <div className="absolute top-10 left-0 bg-slate-900 w-full">
          {suggestions.map((suggestion, index) => (
            <Dropdown.Item
              className="!text-gray-300 hover:bg-slate-700"
              key={suggestion._id}
              onClick={() => handleSuggestionSelect(suggestion.userDefectId)}
            >
              {suggestion.userDefectId}
            </Dropdown.Item>
          ))}
        </div>
      ): }

      <Toast>
        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-100 text-cyan-500 dark:bg-cyan-800 dark:text-cyan-200"></div>
        <div className="ml-3 text-sm font-normal">{toastMessage}</div>
        <Toast.Toggle />
      </Toast>
    </Fragment>
  );
};

export default SearchBar;
