const useSearch = () => {
  return new URLSearchParams(window.location.search);
};
export default useSearch;
