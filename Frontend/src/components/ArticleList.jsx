export default function ArticleList({ articles, onSelect }) {
  return (
    <div className="grid gap-4">
      {articles.map(a => (
        <div key={a._id} onClick={() => onSelect(a._id)} className="border p-4 rounded shadow hover:bg-gray-100 cursor-pointer">
          <h3 className="font-semibold text-lg">{a.title}</h3>
          <p className="text-gray-600">{a.content}</p>
        </div>
      ))}
    </div>
  );
}
