export function Sidebar() {
  return (
    <div>
      <li><a href="/">Home</a></li>
      <li><a href="/">Bookmarks</a></li>
      <li><a href="/explore">Explore</a></li>

      <div className="divider" />

      <li><a href="/chat" className="btn-primary">Start Conversation</a></li>

      <div className="divider" />

      <li><a href="/">Profile</a></li>
      <li><a href="/">Sign out</a></li>
    </div>
  );
}
