FROM docker.elastic.co/beats/filebeat:8.12.2
COPY filebeat.docker.yml /usr/share/filebeat/filebeat.docker.yml
USER root
RUN chown root:filebeat /usr/share/filebeat/filebeat.docker.yml
RUN chmod go-w /usr/share/filebeat/filebeat.docker.yml
USER filebeat