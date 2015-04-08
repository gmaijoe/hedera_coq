class AddPasswordToUser < ActiveRecord::Migration
  def change
    add_column :users, :password_digest, :string
    add_column :users, :salt, :integer
    User.reset_column_information
    User.all.each do |user|
      @saltNum = rand()
      user.salt = @saltNum
      user.password_digest = Digest::SHA1.hexdigest(user.last_name.downcase + user.salt.to_s)
      user.save
    end
  end
end
