import computed from "ember-addons/ember-computed-decorators";
import { popupAjaxError } from "discourse/lib/ajax-error";
import { ajax } from "discourse/lib/ajax";

export default Ember.Component.extend({
  tagName: "",

  @computed
  enabled() {
    return this.siteSettings.reviewable_claiming !== "disabled";
  },

  actions: {
    unclaim() {
      ajax(`/reviewable_claimed_topics/${this.get("topic.id")}`, {
        method: "DELETE"
      }).then(() => {
        this.set("topic.claimed_by", null);
      });
    },

    claim() {
      let claim = this.store.createRecord("reviewable-claimed-topic");

      claim
        .save({ topic_id: this.get("topic.id") })
        .then(() => {
          this.set("topic.claimed_by", this.currentUser);
        })
        .catch(popupAjaxError);
    }
  }
});
