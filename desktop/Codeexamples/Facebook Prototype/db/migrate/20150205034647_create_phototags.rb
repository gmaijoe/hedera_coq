class CreatePhototags < ActiveRecord::Migration
  def change
    create_table :phototags do |t|
      t.column :user_id, :integer
      t.column :photo_id, :integer
      t.column :xval, :integer
      t.column :yval, :integer
      t.column :height, :integer
      t.column :width, :integer
    end
  end
end
