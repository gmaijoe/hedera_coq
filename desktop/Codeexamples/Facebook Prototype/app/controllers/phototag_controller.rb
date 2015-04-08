class PhototagController < ApplicationController
  def new
    session[:photoid] = params[:id]
    @photo = Photo.find(session[:photoid])
    @userid = @photo.user_id
    @users = User.all
  end

  def create
    @phototag = Phototag.new
    @phototag.user_id = params[:name]
    @phototag.photo_id = params[:phototag][:photo_id].to_i
    @phototag.xval = params[:phototag][:xval]
    @phototag.yval = params[:phototag][:yval]
    @phototag.height = params[:phototag][:height]
    @phototag.width = params[:phototag][:width]

    if @phototag.save
      redirect_to :controller => :photos, :action => :index, :id => session[:user_id]
    else
      puts @phototag.errors
    end
  end
end
