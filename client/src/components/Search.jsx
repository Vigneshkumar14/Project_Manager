import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [abortController, setAbortController] = useState(null);

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

        setSuggestions(result.data.searchResult);
      } catch (err) {
        if (err.name !== "CanceledError") {
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
      {searchText.length > 0 && (
        <div>
          {suggestions.length > 0 ? (
            <div className="absolute top-10 left-0 bg-slate-900 w-full px-2 py-2 rounded-md border">
              {suggestions.map((suggestion, index) => (
                <div
                  className="!text-gray-300 hover:bg-slate-700 py-1 px-1 cursor-pointer rounded-lg"
                  key={suggestion._id}
                  onClick={() =>
                    handleSuggestionSelect(suggestion.userDefectId)
                  }
                >
                  {suggestion.userDefectId}
                </div>
              ))}
            </div>
          ) : (
            suggestions.length === 0 && (
              <div className="absolute top-10 left-0 bg-slate-900 w-full px-2 py-2 rounded-md border">
                <div className="!text-gray-300 hover:bg-slate-700 py-1 px-1 cursor-pointer rounded-lg">
                  {" "}
                  No results found
                </div>
              </div>
            )
          )}
        </div>
      )}
    </Fragment>
  );
};

export default SearchBar;
