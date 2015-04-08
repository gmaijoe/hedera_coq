class CreatePhotos < ActiveRecord::Migration
  def change
    create_table :photos do |t|
      t.column :user_id, :integer
      t.column :date_time, :datetime
      t.column :file_name, :string
    end
  end
end
