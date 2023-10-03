const Filter = ({ handleFilter, filter }) => {
  return (
    <div>
      filter shown with <input onChange={handleFilter} value={filter} />
    </div>
  );
};

export default Filter;
