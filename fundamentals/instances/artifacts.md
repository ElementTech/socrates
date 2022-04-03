# Artifacts

Any files created during the run of an Instance will be saved (also in sub directories). Deleting a run in history will not delete it's artifacts_,_ but you can delete them directly in the Artifacts page of each Instance Run. Artifacts are available for each run which created them.

{% hint style="info" %}
Artifacts are saved in Minio S3. The Storage link can guide you to the Artifacts S3 Bucket. Inside they are saved using _InstanceID/RunID/Artifacts_
{% endhint %}

![](<../../.gitbook/assets/Screen Shot 2022-04-03 at 17.01.20.png>)
