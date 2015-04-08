class CreateComments < ActiveRecord::Migration
  def change
    create_table :comments do |t|
      t.column :photo_id, :integer
      t.column :user_id, :integer
      t.column :date_time, :datetime
      t.column :comment, :string
    end
  end
end
