const ProfileStats = ({
  user,
  stockCount,
}: {
  user: Vectyzen;
  stockCount: number;
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 bg-card border rounded-2xl p-6 shadow-sm">
      <div className="text-center space-y-1">
        <span className="block text-3xl font-bold">{stockCount}</span>
        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
          Assets
        </span>
      </div>
      <div className="text-center space-y-1 border-l">
        <span className="block text-3xl font-bold">{user?.totalFollowers}</span>
        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
          Followers
        </span>
      </div>
      <div className="text-center space-y-1 border-l">
        <span className="block text-3xl font-bold">{user?.totalFollowing}</span>
        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
          Following
        </span>
      </div>
      <div className="text-center space-y-1 border-l">
        <span className="block text-3xl font-bold text-primary">
          {user?.totalLikes}
        </span>
        <span className="text-xs text-primary/70 uppercase tracking-wider font-semibold">
          Total Likes
        </span>
      </div>
    </div>
  );
};

export default ProfileStats;
