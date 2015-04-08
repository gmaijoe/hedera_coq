class MoviesController < ApplicationController
  def rent
  end
  
  def selectGenre
  end

  def showGenre
    if !request.post? then
      raise "Wrong HTTP method; must be POST"
    end
    if request.xhr? then
      raise "Cannot invoke this URL via Ajax"
    end
    if request.content_type != "application/x-www-form-urlencoded" then
      raise "Illegal request: must specify Content-Type header " +
          "as application/x-www-form-urlencoded"
    end
    if !verified_request? then
      raise "Potential CSRF attack: invalid authenticity token"
    end 
    genre = params[:genre]
    if genre == "All" then
      clause = ""
    else
      clause = " WHERE genre = ?", genre
    end
    @movies = Movie.find_by_sql("SELECT * from movies" + clause + " ORDER BY title;")
  end

end
