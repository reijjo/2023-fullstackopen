const Filter = ({ handleFilter, filter }) => {
  return (
    <div>
      filter shown with{" "}
      <input name="name-filter" onChange={handleFilter} value={filter} />
    </div>
  );
};

export default Filter;
