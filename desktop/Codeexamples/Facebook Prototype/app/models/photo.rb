class Photo < ActiveRecord::Base
  belongs_to :user
  has_many :comments
  has_many :phototags

  def self.search(substring)
    # substring = "" if substring.nil?

    # Filter the states
    # @@states.select { |state| state.downcase.include?(substring.downcase) }
  end
end
