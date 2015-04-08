class PhotosController < ApplicationController
  def index
    @id = params[:id]
    @current_user = User.find(@id)
  end
  def new

  end
  def create
    @photo = params[:photo][:photofilename]
    puts "create function in photo controllers"
    newPhoto = Photo.new
    newPhoto.user_id = session[:user_id]
    newPhoto.date_time = DateTime.now

    File.open(Rails.root.join('app', 'assets', 'images', @photo.original_filename), 'wb') do |file| #ERROR HERE
      file.write(@photo.read)
    end

    newPhoto.file_name = @photo.original_filename #found method on http://goo.gl/2pWkI8 RESET DATABASE
    newPhoto.save
    redirect_to :controller => :photos, :action => :index, :id => session[:user_id]
  end

  def search
    @searchterm = (params[:substring])
    @photouser = Array.new

    for currentphoto in Photo.all
      if currentphoto.user.first_name.downcase.include?(@searchterm) || currentphoto.user.last_name.downcase.include?(@searchterm)
        @photouser.push(currentphoto) #encodeURI
      else
        for currentcomments in currentphoto.comments
          if currentcomments.comment.downcase.include? @searchterm
            @photouser.push(currentphoto) #encodeURI
          end
        end
      end
    end

    #encodeURIComponent()

    render :json => @photouser
  end
end
