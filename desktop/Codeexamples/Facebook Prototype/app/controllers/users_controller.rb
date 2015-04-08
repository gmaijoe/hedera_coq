class UsersController < ApplicationController
  def index
    @users = User.all
  end

  # GET /users/login
  def login

  end

  # POST /users/post_login
  def post_login
    @username = params[:username]
    @password = params[:password]

    current_user = User.find_by(login: @username)
    puts "current user:------------------------------------------------------"
    puts current_user

    if current_user
      @encryptedPassword = Digest::SHA1.hexdigest(@password.to_s + current_user.salt.to_s)
      current_password = User.find_by_password_digest(@encryptedPassword)
      puts "current password:------------------------------------------------------"
      puts current_password
      puts @encryptedPassword
    end

    if current_user != nil  && current_password != nil #if username and password exist in database, continue
      @id = current_user.id #???
      session[:user_id] = @id #intialize session?
      session[:firstname] = current_user.first_name
      redirect_to :controller => :photos, :action => :index, id: @id #redirect after session ok
    elsif current_user == nil && current_password == nil #if fields are empty
      flash[:emptyuser] = "Please type in a username and password"
      redirect_to :controller => :users, :action => :login #redirect if login is not correct
    else #any other case
      flash[:wronguserpass] = "Your username/password does not exist and/or is wrong. Please try again"
      redirect_to :controller => :users, :action => :login #redirect if login is not correct
    end
  end

  # LOGOUT /users/logout
  def logout
    reset_session
    redirect_to :controller => :users, :action => :login
  end

  def new

  end

  def create
    newUser = User.new
    @firstname = params[:firstname]
    @lastname = params[:lastname]
    @possibleUsername = params[:possibleusername]
    @firstpassword = params[:firsttrypassword]
    @secondpassword = params[:secondtrypassword]

    @variable = User.password_valid?(@firstpassword, @secondpassword)

    newUser.first_name = @firstname
    newUser.last_name = @lastname
    newUser.login = @possibleUsername

    if @variable == true #calls user model, runs if passwords are valid
      # @password = User.password
      # User.password=(@password)
      #Couldn't get virtual passwords to work, so just did it in the controller ======================
      @saltNum = rand()
      newUser.salt = @saltNum
      @passwordDIG = Digest::SHA1.hexdigest(@firstpassword.to_s + newUser.salt.to_s)
      newUser.password_digest = @passwordDIG
      # puts "the password from SHA a 40 hexdigit is"
      # puts @passwordDIG
      newUser.save
      redirect_to :controller => :users, :action => :login #redirect to login page if creating user is successful
    else
      flash[:nomatchpass] = "Your Passwords do not match Please try again"
      redirect_to :controller => :users, :action => :new #redirect if login is not correct
    end
  end
end
