class Comment < ActiveRecord::Base
  belongs_to :user
  belongs_to :photo

  # validates :comment, presence: true #found on http://guides.rubyonrails.org/active_record_validations.html#presence
  #doesn't seem to work...tried everything
  # validates :comment, length: { minimum: 0 }
end
