
type Props = {
  loading: boolean;
  onClick: 
}


export default SearchButton(props: Props) {


  return <button
  classList={{ btn: true }}
  onClick={(e) => {
    console.log('start query' + input());
    if (input().trim()) {
      e.preventDefault;
      setQuery('');
      setQuery(input());
    }
  }}
>
  Search
</button>

}