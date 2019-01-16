# Squid Proxy for Auth testing

IMAGE = "debian/stretch64"

Vagrant.configure("2") do |config|

  config.vm.define "squid" do |subconfig|
    subconfig.vm.box = IMAGE
    subconfig.vm.hostname = "squid"
    subconfig.vm.network "forwarded_port", guest: 3128, host: 3128
    subconfig.vm.provider "virtualbox" do |v|
      v.name = "squid"
      v.memory = 2048
    end
    subconfig.vm.provision "shell", run: "always", path: "squid.sh"
  end
end
