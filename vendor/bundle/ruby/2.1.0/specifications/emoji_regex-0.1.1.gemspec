# -*- encoding: utf-8 -*-
# stub: emoji_regex 0.1.1 ruby lib

Gem::Specification.new do |s|
  s.name = "emoji_regex"
  s.version = "0.1.1"

  s.required_rubygems_version = Gem::Requirement.new(">= 0") if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib"]
  s.authors = ["Jessica Stokes"]
  s.date = "2017-07-24"
  s.description = "A pair of Ruby regular expressions for matching Unicode Emoji symbols."
  s.email = "hello@jessicastokes.net"
  s.homepage = "https://github.com/ticky/ruby-emoji-regex"
  s.licenses = ["MIT"]
  s.rubygems_version = "2.2.2"
  s.summary = "Emoji Regex"

  s.installed_by_version = "2.2.2" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_development_dependency(%q<bundler>, ["~> 1.15"])
      s.add_development_dependency(%q<rake>, ["~> 10.0"])
      s.add_development_dependency(%q<rspec>, ["~> 3.0"])
    else
      s.add_dependency(%q<bundler>, ["~> 1.15"])
      s.add_dependency(%q<rake>, ["~> 10.0"])
      s.add_dependency(%q<rspec>, ["~> 3.0"])
    end
  else
    s.add_dependency(%q<bundler>, ["~> 1.15"])
    s.add_dependency(%q<rake>, ["~> 10.0"])
    s.add_dependency(%q<rspec>, ["~> 3.0"])
  end
end
