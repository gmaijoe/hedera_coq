class User < ActiveRecord::Base

  has_many :photos
  has_many :comments
  has_many :phototags

  def self.password
    #set raw value of password to instance variable of password
    @password = params[:firsttrypassword]
    return @password
  end

  def self.password=(userpassword)
    # first_name, last_name = userpassword.split()
    @saltNum = rand()
    self.salt = @saltNum #sets salt attribute
    self.password_digest = Digest::SHA1.hexdigest(userpassword.to_s + self.salt.to_s) #sets password digest attribute
    self.save
  end

  def self.password_valid?(firstPassword, secondPassword)
    if firstPassword == secondPassword
      return true
    else
      return false
    end
  end

  #validates :first_name, :last_name, :login, precence: true
  #I don't think this works, error: Unknown validator: 'PrecenceValidator' ^^^
end

